using CertiPath.BlockchainGateway.DataLayer;
using CertiPath.BlockchainGateway.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service
{
    public class Authenticate
    {
        private DataModelContainer _context;

        public Authenticate(DataModelContainer context)
        {
            _context = context;
        }

        public AuthenticationResponseModel Login(AuthenticationModel model)
        {
            AuthenticationResponseModel res = new AuthenticationResponseModel() { IsAuthenticated = false };
            
            // TODO: Must deal with password and everything else
            var user = _context.User.Where(w => w.Email == model.Username).SingleOrDefault();

            if (user != null)
            {
                res.IsAuthenticated = true;
                res.FirstName = user.FirstName;
                res.LastName = user.LastName;
                res.Email = user.Email;
            }
            return res;
        }
    }
}
