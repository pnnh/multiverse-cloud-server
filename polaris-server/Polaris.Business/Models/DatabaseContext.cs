using Microsoft.EntityFrameworkCore;

namespace Polaris.Business.Models;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<PostModel> Pages => Set<PostModel>();
    public DbSet<AccountModel> Accounts => Set<AccountModel>();
    public DbSet<CredentialTable> Credentials => Set<CredentialTable>();
    public DbSet<SessionTable> Sessions => Set<SessionTable>();
    public DbSet<PartitionModel> Partitions => Set<PartitionModel>();
    public DbSet<TagModel> Tags => Set<TagModel>();
    public DbSet<CommentModel> Comments => Set<CommentModel>();
    public DbSet<RelationModel> Relations => Set<RelationModel>();
    public DbSet<ChannelModel> Channels => Set<ChannelModel>();
    public DbSet<ViewerModel> Viewers => Set<ViewerModel>();
    public DbSet<PictureModel> Pictures => Set<PictureModel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }
}