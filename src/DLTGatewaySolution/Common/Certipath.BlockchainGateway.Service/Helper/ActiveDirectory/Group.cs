using CertiPath.BlockchainGateway.DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CertiPath.BlockchainGateway.Service.Helper.ActiveDirectory
{

    internal class Group
    {
        private DataModelContainer _context;

        public Group(DataModelContainer context)
        {
            _context = context;
        }

        public Model.UserGroupModel Save(Model.LDAPGroupModel group)
        {
            var grp = _context.UserGroup
                                .Where(w => w.Deleted == false)
                                .Where(w => w.SID == group.SID)
                                .SingleOrDefault();

            if (grp == null)
            {
                grp = new UserGroup()
                {
                    Deleted = false,
                    GUID = Guid.NewGuid(),
                    IsActiveDirectory = true,
                    IsSecurityGroup = true,
                    msDSPrincipalName = group.msDSPrincipalName,
                    Name = group.Name,
                    SID = group.SID
                };
                _context.UserGroup.Add(grp);
                _context.SaveChanges();
            }

            return new Model.UserGroupModel() {
                GUID = grp.GUID,
                Name = grp.Name,
                SID = grp.SID
            };

        }
    }
}
