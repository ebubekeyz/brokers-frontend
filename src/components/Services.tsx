
import { BriefcaseIcon, CurrencyDollarIcon, ChartBarIcon, UserGroupIcon, BanknotesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    title: "Investment Planning",
    description: "Tailored strategies to help you build wealth, reduce risk, and meet long-term financial goals.",
    icon: <ChartBarIcon className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Wealth Management",
    description: "Comprehensive solutions for managing and growing your assets with expert guidance.",
    icon: <BanknotesIcon className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Forex & Stock Trading",
    description: "Access global markets with real-time data and expert analysis for smarter trading decisions.",
    icon: <CurrencyDollarIcon className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Retirement Advisory",
    description: "Plan a secure future with customized retirement solutions and pension strategies.",
    icon: <ShieldCheckIcon className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Corporate Investment",
    description: "Investment and risk management services tailored for businesses and high-net-worth clients.",
    icon: <BriefcaseIcon className="h-10 w-10 text-blue-600" />,
  },
  {
    title: "Client Education",
    description: "Empowering clients through workshops, newsletters, and one-on-one sessions on financial literacy.",
    icon: <UserGroupIcon className="h-10 w-10 text-blue-600" />,
  },
];

const Services: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">
            We offer a full suite of financial services to help you grow, protect, and manage your wealth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{service.title}</h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
