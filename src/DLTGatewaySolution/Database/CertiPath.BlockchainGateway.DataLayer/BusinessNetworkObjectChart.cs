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
    
    public partial class BusinessNetworkObjectChart
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public System.Guid BusinessNetworkObjectGUID { get; set; }
        public System.Guid ChartTypeGUID { get; set; }
        public string ChartSettings { get; set; }
        public int SortOrder { get; set; }
        public bool Deleted { get; set; }
        public bool Disabled { get; set; }
    
        public virtual BusinessNetworkObject BusinessNetworkObject { get; set; }
        public virtual ChartType ChartType { get; set; }
    }
}
