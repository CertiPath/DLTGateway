using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.DataStore
{
    internal class DataStoreHistory
    {
        internal void Add(DataLayer.DataStore data)
        {
            DataModelContainer context = DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.DataLayer.DataStoreHistory history = new CertiPath.BlockchainGateway.DataLayer.DataStoreHistory();

            history.GUID = Guid.NewGuid();
            history.DataStoreGUID = data.GUID;
            history.SourceID = data.SourceID;
            history.TransactionHistoryGUID = data.TransactionHistoryGUID;
            history.Value = data.Value;
            history.CreatedOn = data.LastUpdatedOn == null ? DateTime.UtcNow : (DateTime)data.LastUpdatedOn;

            context.DataStoreHistory.Add(history);
            context.SaveChanges();
        }
    }
}
