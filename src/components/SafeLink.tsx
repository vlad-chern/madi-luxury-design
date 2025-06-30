
import { Link, LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SafeLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const SafeLink = ({ to, children, className, ...props }: SafeLinkProps) => {
  // Нормализуем путь
  const normalizedPath = to.startsWith('/') ? to : `/${to}`;
  
  return (
    <Link 
      to={normalizedPath} 
      className={cn(className)} 
      {...props}
    >
      {children}
    </Link>
  );
};

export default SafeLink;
