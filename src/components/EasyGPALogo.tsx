import { motion } from 'framer-motion';

interface EasyGPALogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

const EasyGPALogo = ({ size = 'md', showText = true, onClick }: EasyGPALogoProps) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl lg:text-2xl' },
    lg: { icon: 40, text: 'text-2xl lg:text-3xl' },
  };

  const { icon, text } = sizeMap[size];

  return (
    <motion.button 
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {/* Logo Icon */}
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary"
        style={{ width: icon, height: icon }}
      >
        {/* Stylized "E" mark */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className="w-[60%] h-[60%]"
        >
          <path 
            d="M6 4h12M6 12h10M6 20h12M6 4v16" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-primary-foreground"
          />
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-50 blur-md -z-10" />
      </div>

      {showText && (
        <span className={`${text} font-display font-bold gradient-text`}>
          EasyGPA
        </span>
      )}
    </motion.button>
  );
};

export default EasyGPALogo;
