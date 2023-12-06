namespace Polaris.Business.Models;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Text.Json.Serialization;

[Table("partitions")]
[PrimaryKey(nameof(Pk))]
public class PartitionModel
{
    [Column("pk", TypeName = "varchar(64)")]
    public string Pk { get; set; } = "";

    [Column("title", TypeName = "varchar(128)")]
    public string Title { get; set; } = "";

    [Column("name", TypeName = "varchar(96)")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [Column("create_time", TypeName = "timestamptz")]
    [JsonPropertyName("create_time")]
    public DateTime CreateTime { get; set; } = DateTime.MinValue;

    [Column("update_time", TypeName = "timestamptz")]
    [JsonPropertyName("update_time")]
    public DateTime UpdateTime { get; set; } = DateTime.MinValue;

    [Column("creator", TypeName = "varchar(64)")]
    public string Creator { get; set; } = "";

    [Column("description", TypeName = "varchar(256)")]
    public string Description { get; set; } = "";

    [Column("channel", TypeName = "varchar(96)")]
    [JsonPropertyName("channel")]
    public string Channel { get; set; } = "";

    [Column("parent", TypeName = "varchar(96)")]
    [JsonPropertyName("parent")]
    public string Parent { get; set; } = "";
}

public class PartitionQueryModel
{
    [Column("root_pk", TypeName = "varchar(64)")]
    [JsonPropertyName("root_pk")]
    public string RootPk { get; set; } = "";

    [Column("root_name", TypeName = "varchar(96)")]
    [JsonPropertyName("root_name")]
    public string RootName { get; set; } = "";

    [Column("leaf_pk", TypeName = "varchar(96)")]
    [JsonPropertyName("leaf_pk")]
    public string LeafPk { get; set; } = "";

    [Column("leaf_name", TypeName = "varchar(96)")]
    [JsonPropertyName("leaf_name")]
    public string LeafName { get; set; } = "";
    
    [Column("root_level", TypeName = "integer")]
    [JsonPropertyName("root_level")]
    public int RootLevel { get; set; } = 0;

    [Column("parent", TypeName = "varchar(96)")]
    [JsonPropertyName("parent")]
    public string Parent { get; set; } = "";
    
    public static void MapperConfig(IMapperConfigurationExpression cfg)
    {
        cfg.CreateMap<IDataReader, PartitionQueryModel>()
            .ForMember(a => a.RootPk, opt => opt.MapFrom(src => src["root_pk"]))
            .ForMember(a => a.RootName, opt => opt.MapFrom(src => src["root_name"]))
            .ForMember(a => a.LeafPk, opt => opt.MapFrom(src => src["leaf_pk"]))
            .ForMember(a => a.LeafName, opt => opt.MapFrom(src => src["leaf_name"]))
            .ForMember(a => a.RootLevel, opt => opt.MapFrom(src => src["root_level"]));
    }
}