/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects(){
        return [
        {
            destination:"/conversations",
            source:"/",
            permanent:true,
        }
        ]
    }
};

export default nextConfig;
