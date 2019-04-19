using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.BackgroundService
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
            /*
            Service1 srv = new Service1();
            Model.BusinessNetworkNamespaceModel obj = new Model.BusinessNetworkNamespaceModel();
            obj.NamespaceName = "temperaturetest-network";
            obj.BlockchainFrameworkGUID = new Guid("77FC57A8-08D3-4542-9700-0D3F3E01E628");
            obj.BlockchainFrameworkName = "HLF";
            obj.NamespaceGUID = new Guid("244B066D-88C9-46C5-AF91-22F30851FD3A");
            obj.NetworkGUID = new Guid("12E073A0-1AEF-49BE-8357-F64006650F61");
            obj.NetworkName = "ComposerChannel - Ubuntu 1";

            obj.ObjectList = new List<Model.BusinessNetworkObjectModel>();
            obj.ObjectList.Add(new Model.BusinessNetworkObjectModel()
            {
                GUID = new Guid("E21EB49F-7712-4576-98F8-F9BBFA1385FF"),
                BusinessNetworkNamespaceGUID = new Guid("244B066D-88C9-46C5-AF91-22F30851FD3A"),
                ClassName = "org.certipath.iot.temperaturetest.Device",
                Name = "Device"
            });
            obj.ObjectList.Add(new Model.BusinessNetworkObjectModel()
            {
                GUID = new Guid("554CA552-8A1A-4446-8E01-D7E379BD93A8"),
                BusinessNetworkNamespaceGUID = new Guid("244B066D-88C9-46C5-AF91-22F30851FD3A"),
                ClassName = "org.certipath.iot.temperaturetest.ReportTemperature",
                Name = "ReportTemperature"
            });
            */

            /*
            Service1 srv = new Service1();
            Model.BusinessNetworkNamespaceModel obj = new Model.BusinessNetworkNamespaceModel();
            obj.NamespaceName = "Fabcar";
            obj.BlockchainFrameworkGUID = new Guid("77FC57A8-08D3-4542-9700-0D3F3E01E628");
            obj.BlockchainFrameworkName = "HLF";
            obj.NamespaceGUID = new Guid("D9FDAD99-7C67-4D8B-AA24-A762C76C8AEB");
            obj.NetworkGUID = new Guid("23232BC6-6206-4175-BBD3-2A044F4CF285");
            obj.NetworkName = "ComposerChannel - Ubuntu 1";

            obj.ObjectList = new List<Model.BusinessNetworkObjectModel>();
            obj.ObjectList.Add(new Model.BusinessNetworkObjectModel()
            {
                GUID = new Guid("2BE92970-80C2-4478-AF98-6D743F3E016A"),
                BusinessNetworkNamespaceGUID = new Guid("D9FDAD99-7C67-4D8B-AA24-A762C76C8AEB"),
                ClassName = "fabcar",
                Name = "Car"
            });
            */

            //Service1.processNamespace(obj);

            
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new Service1()
            };
            ServiceBase.Run(ServicesToRun);
            
        }
    }
}
