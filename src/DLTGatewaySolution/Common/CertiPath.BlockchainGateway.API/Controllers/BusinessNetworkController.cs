using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    [Authorize]
    public class BusinessNetworkController : ApiController
    {
        //[HttpGet()]
        public BusinessNetworkTableModel GetAll()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(context);
            var list = srvBN.GetAll();
            return list;
        }

        public BusinessNetworkModel GetDetails(Guid GUID)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(context);
            var res = srvBN.GetDetails(GUID);
            return res;
        }

        public BusinessNetworkModel GetMetadata()
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(context);
            var res = srvBN.GetMetadata();
            return res;
        }

        [HttpPost]
        public ApiResult Save(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
            var result = bnet.Save(obj);
            return result;
        }

        [HttpPost]
        public void Delete(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
            bnet.Delete(obj);
        }

        [HttpPost]
        public void Enable(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
            bnet.Enable(obj);
        }

        [HttpPost]
        public void Disable(BusinessNetworkModel obj)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
            bnet.Disable(obj);
        }

        [HttpPost]
        public void DeleteConnectionFile(FileUploadModel file)
        {
            // TODO: Deal with response object and do error handling
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
            bnet.DeleteConnectionFile(file.GUID);
        }

        [HttpPost]
        public void SaveConnectionFile(BusinessNetworkModel obj)
        {
            DataLayer.DataModelContainer context = DataLayer.DataModelContainer.Builder().Build();
            // TODO: Deal with response object and do error handling
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                // Get the uploaded image from the Files collection
                var httpPostedFile = HttpContext.Current.Request.Files["file"];
                var givenName = HttpContext.Current.Request.Params["name"];
                Guid bneGUID = new Guid(HttpContext.Current.Request.Params["BusinessNetworkGUID"]);

                if (httpPostedFile != null)
                {
                    CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(context);
                    BinaryReader br = new BinaryReader(httpPostedFile.InputStream);
                    byte[] fileData = br.ReadBytes(httpPostedFile.ContentLength);

                    FileUploadModel model = new FileUploadModel()
                    {
                        FileContent = fileData,
                        FileName = httpPostedFile.FileName,
                        Name = givenName,
                        TypeExtension = httpPostedFile.ContentType,
                        Length = httpPostedFile.ContentLength
                    };
                    bnet.AddConnectionFile(bneGUID, model);
                }
            }
        }
    }
}
