//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CertiPath.BlockchainGateway.DataLayer
{
    using System;
    using System.Collections.Generic;
    
    public partial class vDataStore
    {
        public System.Guid BusinessNetworkGUID { get; set; }
        public string BusinessNetworkName { get; set; }
        public System.Guid BusinessNetworkNamespaceGUID { get; set; }
        public string BusinessNetworkNamespaceName { get; set; }
        public System.Guid BusinessNetworkObjectGUID { get; set; }
        public string BusinessNetworkObjectClassName { get; set; }
        public string BusinessNetworkObjectName { get; set; }
        public System.Guid DataStoreGUID { get; set; }
        public bool DataStoreIsDeleted { get; set; }
        public string DataStoreSourceID { get; set; }
        public string DataStoreValue { get; set; }
        public Nullable<System.DateTime> DataStoreLastUpdatedOn { get; set; }
    }
}
