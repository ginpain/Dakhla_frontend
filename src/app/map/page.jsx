import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false
});
export default function MapPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Map/>
            
        </div>
    );
}