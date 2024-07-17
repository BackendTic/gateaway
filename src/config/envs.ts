
import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars{
    PORT: number;
    IMPLEMENTOS_MICROSERVICE_HOST: string
    IMPLEMENTOS_MICROSERVICE_PORT: number
    ESPACIOS_MICROSERVICE_HOST: string
    ESPACIOS_MICROSERVICE_PORT: number
    RESERVAS_MICROSERVICE_HOST: string
    RESERVAS_MICROSERVICE_PORT: number
    HOST_GATEWAY: string
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    IMPLEMENTOS_MICROSERVICE_HOST: joi.string().required(),
    IMPLEMENTOS_MICROSERVICE_PORT: joi.number().required(),
    ESPACIOS_MICROSERVICE_HOST: joi.string().required(),
    ESPACIOS_MICROSERVICE_PORT: joi.number().required(),
    RESERVAS_MICROSERVICE_HOST: joi.string().required(),
    RESERVAS_MICROSERVICE_PORT: joi.number().required(),
    HOST_GATEWAY: joi.string().required(),
})
.unknown(true)

const {error, value} = envsSchema.validate(process.env)
if(error){
    throw new Error(`Config validation error: ${error.message}`)
}
const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    implementosMicroserviceHost: envVars.IMPLEMENTOS_MICROSERVICE_HOST,
    implementosMicroservicePort: envVars.IMPLEMENTOS_MICROSERVICE_PORT,
    espaciosMicroserviceHost: envVars.ESPACIOS_MICROSERVICE_HOST,
    espaciosMicroservicePort: envVars.ESPACIOS_MICROSERVICE_PORT,
    reservasMicroserviceHost: envVars.RESERVAS_MICROSERVICE_HOST,
    reservasMicroservicePort: envVars.RESERVAS_MICROSERVICE_PORT,
    gatewayHost: envVars.HOST_GATEWAY
}

