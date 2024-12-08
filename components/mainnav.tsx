import Link from "next/link";
import { useParams, usePathname } from "next/navigation"


const MainNav = () => {
    const { storeId } = useParams();
    const pathname = usePathname();

    const routes = [
        {
            name: "Overview",
            href: `/${storeId}`,
            active: pathname === `/${storeId}`
        },
        {
            name: "Billboards",
            href: `/${storeId}/billboards`,
            active: pathname === `/${storeId}/billboards`
        }, 
        {
            name: "Categories",
            href: `/${storeId}/categories`,
            active: pathname === `/${storeId}/categories`
        }, 
        {
            name: "Sizes",
            href: `/${storeId}/sizes`,
            active: pathname === `/${storeId}/sizes`
        }, 
        {
            name: "Settings",
            href: `/${storeId}/settings`,
            active: pathname === `/${storeId}/settings`
        }
    ]

    //  smooth responsive navigation, completeing Navbar 

  return (
    
    <nav className='flex  mx-6 space-x-4'>
        {routes.map(route => (
            <Link key={route.name} href={route.href}>
            <span className={`
                px-3
                py-2
                text-sm
                font-medium
                rounded-md
                
                dark:text-gray-200
                dark:hover:bg-gray-700
                hover:bg-gray-100
            `}
            style={{
                backgroundColor: route.active ? "#f3f4f6" : ""
            }}
            >
                {route.name}
            </span>
        </Link>
        ))}
    </nav>
  )
}

export default MainNav