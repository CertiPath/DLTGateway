using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CertiPath.BlockchainGateway.API.Controllers
{
    public class BusinessNetworkController : BaseController
    {
        public BusinessNetworkTableModel GetAll()
        {
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var list = srvBN.GetAll(_allNetworkViewList, _allNetworkAdminList);


            for (int i=0; i<list.List.Count(); i++)
            {
                bool lCanAdmin = CanAdminNetwork(list.List.ElementAt(i).GUID);
                list.List.ElementAt(i).ReadOnly = !lCanAdmin;
            }
            return list;
        }

        public BusinessNetworkModel GetDetails(Guid GUID)
        {
            if (CanViewNetwork(GUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            bool lCanAdmin = CanAdminNetwork(GUID);

            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var res = srvBN.GetDetails(GUID, _globalView, _userGroups);

            res.ReadOnly = !lCanAdmin;
            return res;
        }

        public BusinessNetworkModel GetMetadata()
        {
            CertiPath.BlockchainGateway.Service.BusinessNetwork srvBN = new Service.BusinessNetwork(DatabaseContext);
            var res = srvBN.GetMetadata();
            return res;
        }

        [HttpPost]
        public ApiResult Save(BusinessNetworkModel obj)
        {
            // only super admin users can add new biz network records
            bool lCanSave = CanAdminNetwork(obj.GUID);
            if (lCanSave == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_DENIED_SUPER_ADMIN);
            }

            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            var result = bnet.Save(obj);
            return result;
        }

        [HttpPost]
        public void Delete(BusinessNetworkModel obj)
        {
            if (CanAdminNetwork(obj.GUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Delete(obj);
        }

        [HttpPost]
        public void Enable(BusinessNetworkModel obj)
        {
            if (CanAdminNetwork(obj.GUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Enable(obj);
        }

        [HttpPost]
        public void Disable(BusinessNetworkModel obj)
        {
            if (CanAdminNetwork(obj.GUID) == false)
            {
                throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
            }

            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.Disable(obj);
        }

        [HttpPost]
        public void DeleteConnectionFile(FileUploadModel file)
        {
            var bnfu = DatabaseContext.BusinessNetwork_FileUpload
                                    .Where(w => w.FileUploadGUID == file.GUID)
                                    .SingleOrDefault();

            if (bnfu != null)
            {
                if (CanAdminNetwork(bnfu.BusinessNetworkGUID) == false)
                {
                    throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
                }
            }

            // TODO: Deal with response object and do error handling
            CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
            bnet.DeleteConnectionFile(file.GUID);
        }
        
        [HttpPost]
        public void SaveConnectionFile()
        {
            // TODO: Deal with response object and do error handling
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                // Get the uploaded image from the Files collection
                var httpPostedFile = HttpContext.Current.Request.Files["file"];
                var givenName = HttpContext.Current.Request.Params["name"];
                Guid bneGUID = new Guid(HttpContext.Current.Request.Params["BusinessNetworkGUID"]);

                if (CanAdminNetwork(bneGUID) == false)
                {
                    throw new Exception(Helper.Contstants.PERMISSION_ACCESS_DENIED);
                }

                if (httpPostedFile != null)
                {
                    CertiPath.BlockchainGateway.Service.BusinessNetwork bnet = new Service.BusinessNetwork(DatabaseContext);
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
