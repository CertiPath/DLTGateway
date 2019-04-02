using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Model
{
    public class ApiResult
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public Guid Key { get; set; }
    }

    public class SelectModel
    {
        public string value { get; set; }
        public string label { get; set; }
    }
    
}
