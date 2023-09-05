import Image from 'next/image';

interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center md:items-start md:justify-end">
      <h2 className="absolute font-lora text-3xl md:mb-4 md:text-4xl text-center md:text-left balanced">{title}</h2>

      <div className="relative grid grid-cols-2 md:grid-cols-1 w-full max-w-lg px-4 md:px-0 pt-2">
        <Image src="/decoratorLeft.svg" className="md:hidden" width={512} height={512} alt="title decorator" />
        <Image src="/decorator.svg" className="" width={512} height={512} alt="title decorator" />
      </div>
    </div>
  );
};

export default Title;
