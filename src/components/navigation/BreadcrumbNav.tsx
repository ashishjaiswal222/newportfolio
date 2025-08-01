import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <FaHome className="mr-1 h-3 w-3" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <FaChevronRight className="h-3 w-3" />
        </BreadcrumbSeparator>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage className="text-foreground/70">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.current && index < items.length - 1 && (
              <BreadcrumbSeparator>
                <FaChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav; 