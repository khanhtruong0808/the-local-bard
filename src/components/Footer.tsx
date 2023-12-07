const navigation = [
  { name: "Contact", href: "/contact" },
  { name: "Theater Login", href: "/login" },
];

export const Footer = () => {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4 sm:py-10 lg:px-8">
        <nav
          className="-mb-6 flex columns-2 justify-center space-x-12"
          aria-label="Footer"
        >
          {navigation.map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                className="text-sm leading-6 text-zinc-400 hover:text-white"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          &copy; 2023 The Local Bard. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
