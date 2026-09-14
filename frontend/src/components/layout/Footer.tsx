import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    产品: [
      { label: '生成品牌', href: '/brand' },
      { label: '设计系统', href: '/design-system' },
      { label: '导出', href: '/export' },
    ],
    资源: [
      { label: '文档', href: 'https://github.com/your-username/omni-route-design' },
      { label: 'GitHub', href: 'https://github.com/your-username/omni-route-design' },
      { label: '问题反馈', href: 'https://github.com/your-username/omni-route-design/issues' },
    ],
    法律: [
      { label: '隐私政策', href: '#' },
      { label: '服务条款', href: '#' },
      { label: '开源许可', href: 'https://github.com/your-username/omni-route-design/blob/main/LICENSE' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">OmniRoute Design System</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Open source branding & design system tool — run locally, use your own AI keys.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} OmniRoute Team. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
};