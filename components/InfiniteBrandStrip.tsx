import React from 'react';
import { Activity } from 'lucide-react';
import { Brand } from '../types';

interface InfiniteBrandStripProps {
    brands: Brand[];
}

export const InfiniteBrandStrip: React.FC<InfiniteBrandStripProps> = ({ brands }) => {
    // Duplicate array to ensure smooth loop
    const loopedBrands = [...brands, ...brands, ...brands]; 

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
                {loopedBrands.map((brand, idx) => (
                    <li key={`${brand.id}-${idx}`} className="flex items-center gap-2 text-xl font-bold text-muted-foreground whitespace-nowrap hover:text-foreground transition-colors duration-300">
                         <Activity className="w-6 h-6 text-primary" />
                         <span>{brand.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};