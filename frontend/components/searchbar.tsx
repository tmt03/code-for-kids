import { SearchIcon } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="relative w-64 sm:w-80">
            <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="w-full py-2 pl-10 pr-4 text-black bg-[#B0E2FF] border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#000000] focus:outline-none focus:bg-[#87CEFA] transition-colors placeholder:text-gray-600"
            />
            <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5"
            />
        </div>
    );
}