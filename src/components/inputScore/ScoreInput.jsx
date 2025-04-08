import React, { useEffect, useState } from 'react';

function ScoreInput({ value, onChange, min = 0, max = 20 }) {
  const [tempValue, setTempValue] = useState(value.toString());

  // 외부 value가 변경되면 tempValue도 갱신
  useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    let finalValue = tempValue === '' ? 0 : Number(tempValue);
    if (finalValue < min) {
      finalValue = min;
    }
    if (finalValue > max){
        finalValue = max;
    }
    setTempValue(finalValue.toString());
    onChange(finalValue);
  };

  return (
    <input
      type="number"
      min={min}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
}

export default ScoreInput;