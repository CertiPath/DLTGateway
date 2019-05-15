using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.Service;

namespace CertiPath.BlockchainGateway.BackgroundService
{
    public partial class Service1 : ServiceBase
    {
        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            // spawn a thread for each business network namespace we track and want to get the data for
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            BusinessNetwork bneService = new BusinessNetwork(context);
            var list = bneService.GetNamespaces();
            foreach (var item in list)
            {
                Object stateinfo = item;
                ThreadPool.QueueUserWorkItem(new WaitCallback(processNamespace), stateinfo);
            }
        }

        protected override void OnStop()
        {
        }

        internal static void processNamespace(object stateinfo)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            while (true)
            {
                Model.BusinessNetworkNamespaceModel ns = (Model.BusinessNetworkNamespaceModel)stateinfo;
                Log.Info("Process Namespace - START: " + ns.NamespaceName);
                int sleepForSeconds = 60;
                try
                {
                    Helper.SettingHelper sh = new Helper.SettingHelper(context);
                    sleepForSeconds = sh.GetTransactionHistoryJobTimeout();
                    BusinessNetwork bneService = new BusinessNetwork(context);
                    bneService.ProcessNamespace(ns);
                }
                catch (Exception exc)
                {
                    Log.Error("processNamespace Exception", exc);
                }
                finally
                {
                    Log.Info("Process Namespace - END: " + ns.NamespaceName);
                   
                    Log.Info(String.Format("Sleep for {0} seconds", sleepForSeconds.ToString()));
                    Thread.Sleep(sleepForSeconds * 1000);
                }
            }
        }
    }
}
