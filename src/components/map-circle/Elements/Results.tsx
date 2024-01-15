import React from 'react';
import { Switch } from '@headlessui/react';
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface IProps {
  isProportionMethod: boolean;
  // this is react useState hook
  setIsProportionMethod: React.Dispatch<React.SetStateAction<boolean>>;
  data?: number;
}

const Results: React.FC<IProps> = ({ isProportionMethod, setIsProportionMethod, data }) => {
  const result = data;

  return (
    <div className='flex  justify-center items-center'>
      <Switch
        checked={isProportionMethod}
        onChange={setIsProportionMethod}
        className={classNames(
          isProportionMethod ? 'bg-indigo-600' : 'bg-gray-200',
          'mr-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
        )}
      >
        <span className='sr-only'>Use setting</span>
        <span
          aria-hidden='true'
          className={classNames(
            isProportionMethod ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <div className=''>
        <h3 className='mb-5'>
          Interpolation with Tract level Census Data -{' '}
          {isProportionMethod ? 'Areal proportion method' : 'Centroid Based method'}
        </h3>
        {isProportionMethod ? <p>Average income:{result}</p> : <p>Total population: {result}</p>}
      </div>
    </div>
  );
};

export default Results;
