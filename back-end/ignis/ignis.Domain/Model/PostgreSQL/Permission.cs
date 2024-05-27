using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ignis.Domain.Model.PostgreSQL
{
    public class Feature
    {
        public string? FeatureId { get; set; }
        public string? FeatureName { get; set; }
    }
    public class Role
    {
        public string? RoleId { get; set; }
        public string? RoleName { get; set;}
        public List<User> UserId { get; set; }
        
    }
    public class RelationRoleAccess
    {
        public string? RoleId { get; set; }
        public string? FeatureId { get; set; }
        public bool? CanCreate { get; set; }
        public bool? CanDelete { get; set; }
        public bool? CanUpdate { get; set;}
        public bool? CanImport { get; set; }
        public bool? SeeAllUser { get; set; }   
        public bool? CanManageAccess { get; set; }
    }
}
