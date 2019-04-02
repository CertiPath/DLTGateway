using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal class ColorHelper
    {
        private List<string> chartColors = new List<string>()
        {
            "119, 81, 246",
            "241, 26, 100",
            "142, 36, 170",
            "30, 136, 229",
            "0, 149, 152",
            "251, 140, 0",
            "146, 254, 157",
            "255, 133, 88",
            "0, 137, 123",
            "30, 136, 229",
            "255, 141, 96",
            "56, 184, 242",
            "255, 80, 99",
            "94, 53, 177",
            "124, 179, 66"
        };

        internal string GetNextColor(int index)
        {
            if (index >= chartColors.Count)
            {
                index = index % chartColors.Count;
            }
            return chartColors[index];
        }
    }
}
