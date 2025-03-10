using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DynamicImages.Config
{
    public class DynamicImagesConfig
    {
        public bool Enabled { get; set; }

        public List<Instruction> Instructions { get; set; }
    }
}
