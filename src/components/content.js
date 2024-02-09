import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';

export default function Content({ title, subtitle, paragraph, bulletPoints }) {
  return (
    <div className="bg-white px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <p className="text-base font-semibold leading-7 text-indigo-600">{title}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{subtitle}</h1>
                {paragraph.split('\n').map((line, index) => (
                    <p key={index} className="mt-6 text-xl leading-8">{line}</p>
                ))}
                {bulletPoints && (
                    <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
                        {bulletPoints.map((point, index) => (
                            <li key={index} className="flex gap-x-3">
                                <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
      </div>
  );
}
