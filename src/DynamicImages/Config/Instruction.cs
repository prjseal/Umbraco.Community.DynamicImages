using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DynamicImages.Config
{
    public class Instruction
    {
        public string ImageName { get; set; }
        public string DocTypeAlias { get; set; }
        public string Author { get; set; }
        public string TargetPropertyAlias { get; set; }
    }
}
