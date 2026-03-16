import { format, transports } from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        process.env.NODE_ENV === 'production'
          ? format.json()
          : format.combine(
              format.colorize(),
              format.printf(({ timestamp, level, message, context, ms }) => {
                return `[Nest] ${timestamp} ${level} [${context || 'Application'}] ${message} ${ms}`;
              }),
            ),
      ),
    }),
  ],
};
