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
    
    public partial class BusinessNetwork_FileUpload
    {
        public System.Guid GUID { get; set; }
        public System.Guid BusinessNetworkGUID { get; set; }
        public System.Guid FileUploadGUID { get; set; }
        public bool Deleted { get; set; }
    
        public virtual BusinessNetwork BusinessNetwork { get; set; }
        public virtual FileUpload FileUpload { get; set; }
    }
}
