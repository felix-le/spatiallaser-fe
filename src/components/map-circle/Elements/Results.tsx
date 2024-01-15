import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { ISpatialObject } from '../interfaces';
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface IProps {
  isProportionMethod: boolean;
  // this is react useState hook
  setIsProportionMethod: React.Dispatch<React.SetStateAction<boolean>>;
  data?: ISpatialObject[];
}

const Results: React.FC<IProps> = ({ isProportionMethod, setIsProportionMethod, data }) => {
  // const [enabled, setEnabled] = useState(false);

  const sum = data?.reduce(
    (acc, obj) => {
      acc.income += obj.income;
      acc.population += obj.population;
      return acc;
    },
    { income: 0, population: 0 }
  );
  return (
    <div className='flex'>
      <Switch
        checked={isProportionMethod}
        onChange={setIsProportionMethod}
        className={classNames(
          isProportionMethod ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
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

      <div>
        <h3>
          Interpolation with Tract level Census Data -{' '}
          {isProportionMethod ? <p>Areal proportion method</p> : <p>Centroid Based method</p>}
        </h3>

        {sum?.population && (
          <p>
            <strong>Sum Population</strong>:{sum?.population}
          </p>
        )}

        {sum?.income && (
          <p>
            <strong>Average income</strong>:{sum?.income / (data?.length ?? 0)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Results;
