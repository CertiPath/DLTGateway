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
    
    public partial class BusinessNetworkNamespace
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BusinessNetworkNamespace()
        {
            this.BusinessNetworkObject = new HashSet<BusinessNetworkObject>();
        }
    
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public System.Guid BusinessNetworkGUID { get; set; }
        public bool SingleObjectNamespace { get; set; }
        public bool Deleted { get; set; }
    
        public virtual BusinessNetwork BusinessNetwork { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BusinessNetworkObject> BusinessNetworkObject { get; set; }
    }
}
