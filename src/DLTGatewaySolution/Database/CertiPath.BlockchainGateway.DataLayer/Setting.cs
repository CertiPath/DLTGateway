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
    
    public partial class Setting
    {
        public System.Guid GUID { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public Nullable<System.Guid> SettingTypeGUID { get; set; }
        public string Value { get; set; }
        public string ValueType { get; set; }
        public string ValueReference { get; set; }
        public string TooltipText { get; set; }
        public Nullable<int> Order { get; set; }
        public bool UserEditable { get; set; }
        public bool Required { get; set; }
    
        public virtual SettingType SettingType { get; set; }
    }
}
