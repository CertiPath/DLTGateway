﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using Newtonsoft.Json;

namespace CertiPath.BlockchainGateway.Service.Helper.BusinessNetwork
{
    internal class DataStore
    {
        internal void Save(BusinessNetworkObjectModel objToTrack, string id, dynamic write, TransactionHistory transaction)
        {

            DataModelContainer context = DataModelContainer.Builder().Build();
            Helper.Common.EntityConverter converter = new Common.EntityConverter();

            // 1. add new or update existing
            var ds = context.DataStore
                                .Where(w => w.SourceID == id)
                                .Where(w => w.BusinessNetworkObjectGUID == objToTrack.GUID)
                                .SingleOrDefault();

            

            bool lAddNew = false;
            string oldValue = "";
            if (ds == null)
            {
                lAddNew = true;
                ds = new CertiPath.BlockchainGateway.DataLayer.DataStore();
                ds.GUID = Guid.NewGuid();
                ds.BusinessNetworkObjectGUID = objToTrack.GUID;
                ds.SourceID = id;
            }
            else
            {
                oldValue = converter.GetJson(ds);
            }

            ds.IsDeleted = Convert.ToBoolean(write.is_deleted);
            ds.Value = write.value;
            ds.TransactionHistoryGUID = transaction.GUID;
            ds.LastUpdatedOn = DateTime.UtcNow;
            
            if (lAddNew)
            {
                context.DataStore.Add(ds);
            }
            context.SaveChanges();

            // 2. DataStoreHistory
            Helper.DataStore.DataStoreHistory dsh = new Helper.DataStore.DataStoreHistory();
            dsh.Add(ds);

        }
    }
}
