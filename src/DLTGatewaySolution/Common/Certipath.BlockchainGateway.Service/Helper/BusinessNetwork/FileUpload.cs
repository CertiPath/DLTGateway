using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.BusinessNetwork
{
    internal class FileUpload
    {
        DataLayer.DataModelContainer _context;
        internal FileUpload(DataLayer.DataModelContainer context)
        {
            _context = context;
        }

        internal List<FileUploadModel> GetAllByBusinessNetwork(Guid businessNetworkGUID, bool returnContent)
        {
            var list = _context.vBusinessNetworkFile.Where(w => w.BusinessNetworkGUID == businessNetworkGUID).ToList();
            List<FileUploadModel> res = new List<FileUploadModel>();
            foreach (var item in list)
            {
                res.Add(new FileUploadModel()
                {
                    GUID = item.FileUploadGUID,
                    FileContent = returnContent ? item.FileUploadContent : null,
                    Name = item.FileUploadName,
                    FileName = item.FileUploadFileName,
                    TypeExtension = item.FileUploadTypeExtension
                });
            }
            return res;
        }
    }
}
