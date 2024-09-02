import Link from "next/link";

export default function Nav() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-white">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="text-white">
                        Profile
                    </Link>
                </li>
                {/* Add more links as needed */}
            </ul>
        </nav>
    );
}
