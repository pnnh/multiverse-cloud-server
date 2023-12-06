namespace Polaris.Business.Services;

using System.Data.Entity;
using System.Text;
using Polaris.Business.Helpers;
using Polaris.Business.Models;

public class PageService
{
    private readonly ServiceContext serviceContext;

    public PageService(ServiceContext serviceContext)
    {
        this.serviceContext = serviceContext;
    }

    public PLSelectResult<PageModel> Select(string queryString)
    {
        var queryHelper = new PLQueryHelper(queryString);
        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = Pagination.CalcOffset(page, size);

        var totalCount = serviceContext.DataContext.Pages.Count();
        var models = serviceContext.DataContext.Pages.OrderByDescending(o => o.UpdateTime)
        .Skip(offset).Take(limit).ToList();

        return new PLSelectResult<PageModel>
        {
            Range = models,
            Count = totalCount
        };
    }

    public PageModel? GetByQuery(PLQueryHelper queryHelper)
    {
        var profile = queryHelper.GetString("profile");
        var channel = queryHelper.GetString("channel");
        var pathArray = queryHelper.GetStringArray("path");

        if (string.IsNullOrEmpty(profile) || string.IsNullOrEmpty(channel) 
            || pathArray == null || pathArray.Length < 2)
        {
            return null;
        }
        var partitionArray = pathArray.Take(pathArray.Length - 1).ToArray();
        var partitionQueryModel = new PartitionService(this.serviceContext).QueryByPath(partitionArray);
        if (partitionQueryModel == null)
        {
            return null;
        }
        var pageName = pathArray[^1];
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*, p.username as profile_name, c.name as channel_name, @partition_name as partition_name
from pages as a
     join profiles as p on p.pk = a.profile
     join channels as c on c.pk = a.channel
where a.pk is not null and a.name = @page and p.username = @profile and c.name = @channel 
");
        parameters.Add("@profile", profile);
        parameters.Add("@channel", channel);
        parameters.Add("@partition_name", partitionQueryModel.LeafName);
        parameters.Add("@page", pageName);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<PageModel>(this.serviceContext.DataContext, querySqlText, parameters);

        var model = modelsQuery.FirstOrDefault();

        return model;
    }
}