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
    
    public partial class ChartType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ChartType()
        {
            this.BusinessNetworkObjectChart = new HashSet<BusinessNetworkObjectChart>();
        }
    
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public System.Guid ChartCategoryGUID { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }
    
        public virtual ChartCategory ChartCategory { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BusinessNetworkObjectChart> BusinessNetworkObjectChart { get; set; }
    }
}
