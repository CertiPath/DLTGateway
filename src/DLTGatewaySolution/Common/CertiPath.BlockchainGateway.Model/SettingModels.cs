using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public enum GlobalSetting
    {
        BACKGROUND_TRANSHISTORY_TIMEOUT
    }

    public class SettingModel
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

    }
}
