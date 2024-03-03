namespace Molecule.Helpers;

using System.Collections.Specialized;
using System.Text;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Buffers.Binary;
using SimpleBase;
using IdGen;
using Base62;

internal class TestTimeSource : ITimeSource
{
    public DateTimeOffset Epoch { get; } = new(2023, 6, 1, 0, 0, 0, TimeSpan.Zero);

    public TimeSpan TickDuration { get; } = TimeSpan.FromMilliseconds(1);

    public long GetTicks()
    {
        return (long)(DateTimeOffset.UtcNow - Epoch).TotalMilliseconds;
    }
}

public class BizIdendity
{
    public BizIdendity(long id)
    {
        Id = id;
    }

    private long Id { get; }

    public long LongValue()
    {
        return Id;
    }

    public string StringValue()
    {
        var bytes = BitConverter.GetBytes(Id);
        if (BitConverter.IsLittleEndian)
            Array.Reverse(bytes);

        var base62Converter = new Base62Converter(Base62Converter.CharacterSet.INVERTED);
        const string invertedCharacterSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numArray = base62Converter.Encode(bytes);
        var stringBuilder = new StringBuilder();
        foreach (var index in numArray)
            stringBuilder.Append(invertedCharacterSet[index]);
        return stringBuilder.ToString().TrimStart('0');
    }

    public override string ToString()
    {
        return StringValue();
    }
}

public class MIDHelper
{
    public static MIDHelper Default { get; } = new MIDHelper();
    
    static MIDHelper()
    {
        var structure = new IdStructure(47, 6, 10);

        var options = new IdGeneratorOptions(structure, new TestTimeSource());

        Generator = new IdGenerator(0, options);
    }

    private static IdGenerator Generator { get; }

    public static BizIdendity NewIdendity()
    {
        return new BizIdendity(Generator.CreateId());
    }

    public static string LongToBase62(long id)
    {
        return new BizIdendity(id).StringValue();
    }

    public string NewUUIDv7String()
    {
        var uuid = DaanV2.UUID.V7.Generate();

        return uuid.ToString();
    }

    public DaanV2.UUID.UUID NewUUIDv7()
    {
        return DaanV2.UUID.V7.Generate();
    }

    public string ULongBase32(ulong intValue)
    {
        byte[] bytes = new byte[8];
        BinaryPrimitives.WriteUInt64BigEndian(bytes, intValue);
        var list = new List<byte>();
        foreach (var b in bytes)
        {
            if (b != 0)
                list.Add(b);
        }

        var base32String = Base32.Rfc4648.Encode(list.ToArray());
        return base32String.ToLower();
    }

    public ulong? Base32ULong(string base32String)
    {
        if (base32String.Length < 1 || base32String.Length > 16)
        {
            return null;
        }
        base32String = base32String.ToUpper();
        var bytes = new byte[8];

        if (Base32.Rfc4648.TryDecode(base32String, bytes, out int numBytesWritten))
        {
            var list = new List<byte>();
            list.AddRange(bytes.Take(numBytesWritten));
            var itemCount = list.Count;
            for (var i = 0; i < 8 - itemCount; i++)
            {
                list.Insert(0, 0);
            }
            var value = BinaryPrimitives.ReadUInt64BigEndian(list.ToArray());
            return value;
        }
        return null;
    }

    public string ULongBase58(ulong intValue)
    {
        byte[] bytes = new byte[8];
        BinaryPrimitives.WriteUInt64BigEndian(bytes, intValue);
        var list = new List<byte>();
        foreach (var b in bytes)
        {
            if (b != 0)
                list.Add(b);
        }

        var base58String = Base58.Flickr.Encode(list.ToArray());
        return base58String;
    }

    public ulong? Base58ULong(string base58String)
    {
        if (base58String.Length < 1 || base58String.Length > 16)
        {
            return null;
        }
        var bytes = new byte[8];

        if (Base58.Flickr.TryDecode(base58String, bytes, out int numBytesWritten))
        {
            var list = new List<byte>();
            list.AddRange(bytes.Take(numBytesWritten));
            var itemCount = list.Count;
            for (var i = 0; i < 8 - itemCount; i++)
            {
                list.Insert(0, 0);
            }
            var value = BinaryPrimitives.ReadUInt64BigEndian(list.ToArray());
            return value;
        }
        return null;
    }
}