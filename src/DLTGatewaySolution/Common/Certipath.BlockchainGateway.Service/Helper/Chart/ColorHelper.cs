using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace CertiPath.BlockchainGateway.Service.Helper.Chart
{
    internal static class ColorHelper
    {
        private static List<string> chartColors = new List<string>()
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

        internal static string GetNextColor(int index)
        {
            if (index >= chartColors.Count)
            {
                index = index % chartColors.Count;
            }
            return chartColors[index];
        }

        internal static string GetNextColor(int index, bool lHex)
        {
            string colorStr = GetNextColor(index);
            string[] colorArr = colorStr.Split(',');

            Color myColor = Color.FromArgb(
                Convert.ToInt32(colorArr[0].Trim()),
                Convert.ToInt32(colorArr[1].Trim()),
                Convert.ToInt32(colorArr[2].Trim()));

            string color = colorArr[0].Trim().PadLeft(3, '0');
            color += colorArr[1].Trim().PadLeft(3, '0');
            color += colorArr[2].Trim().PadLeft(3, '0');
            return String.Format("#{0:X6}", myColor.ToArgb() & 0x00FFFFFF);
        }


        internal static string GetNextColorRgba(int index, string opacity)
        {
            string color = GetNextColor(index);
            return String.Format("rgba({0}, {1})", color, opacity);
        }
    }
}
