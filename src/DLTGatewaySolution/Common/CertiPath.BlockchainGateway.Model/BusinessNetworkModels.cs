using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class BusinessNetworkTableModel
    {
        public int TotalCount { get; set; }
        public IEnumerable<BusinessNetworkModel> List { get; set; }
    }

    public class BusinessNetworkModel
    {
        public Guid GUID { get; set; }
        public string Name { get; set; }
        public Guid BlockchainFrameworkGUID { get; set; }
        public string BlockchainFrameworkName { get; set; }
        public string PeerAddress { get; set; }
        public string ChannelName { get; set; }
        public bool Disabled { get; set; }
        public string Username { get; set; }
        public string Endpoint { get; set; }

        public List<SelectModel> BlockchainFrameworkList { get; set; }
        public List<FileUploadModel> FileUploadList { get; set; }
        //public List<BusinessNetworkNamespaceAndObjectModel> NamespaceList { get; set; }
    }

    public class BusinessNetworkNamespaceAndObjectModel
    {
        public System.Guid BusinessNetworkGUID { get; set; }
        public System.Guid BusinessNetworkNamespaceGUID { get; set; }
        public string BusinessNetworkNamespaceName { get; set; }
        public Nullable<System.Guid> BusinessNetworkObjectGUID { get; set; }
        public string BusinessNetworkObjectClassName { get; set; }
        public string BusinessNetworkObjectName { get; set; }
        public Nullable<int> ObjectCount { get; set; }
    }

    public class BusinessNetworkNamespaceViewModel
    {
        public System.Guid BusinessNetworkGUID { get; set; }
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public Nullable<int> ObjectCount { get; set; }

        public List<BusinessNetworkObjectViewModel> ObjectList { get; set; }
        
    }

    public class BusinessNetworkObjectViewModel {
        public System.Guid BusinessNetworkNamespaceGUID { get; set; }
        public System.Guid BusinessNetworkObjectGUID { get; set; }
        public string BusinessNetworkObjectClassName { get; set; }
        public string BusinessNetworkObjectName { get; set; }
        public Nullable<int> ObjectCount { get; set; }
    }

    public class BusinessNetworkObjectDetailsModel
    {
        public Guid GUID { get; set; }
        public string Name { get; set; }

        public List<BusinessNetworkObjectPropertyModel> PropertyList { get; set; }
    }

    public class BusinessNetworkObjectPropertyModel
    {
        public Guid GUID { get; set; }
        public Guid BusinessNetworkObjectGUID { get; set; }
        public string Name { get; set; }
        public bool Visible { get; set; }
        public bool Disabled { get; set; }
        public string PropertyTypeCode { get; set; }
        public string PropertyTypeName { get; set; }
        public bool IsImported { get; set; }
    }

    public class BusinessNetworkNamespaceModel
    {
        public System.Guid NamespaceGUID { get; set; }
        public string NamespaceName { get; set; }
        public System.Guid NetworkGUID { get; set; }
        public string NetworkName { get; set; }
        public System.Guid BlockchainFrameworkGUID { get; set; }
        public string BlockchainFrameworkName { get; set; }
        public bool SingleObjectNamespace { get; set; }

        public List<BusinessNetworkObjectModel> ObjectList;
    }

    public class BusinessNetworkObjectModel
    {
        public System.Guid GUID { get; set; }
        public System.Guid BusinessNetworkNamespaceGUID { get; set; }
        public string ClassName { get; set; }
        public string Name { get; set; }
    }

    public class FileUploadModel
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public string TypeExtension { get; set; }
        public byte[] FileContent { get; set; }
        public int Length { get; set; }
    }
}
