import yaml

from .schema import ServiceOptions


def get_options(config_path: str) -> ServiceOptions:
    """
    Read .yml config file and construct service option object.

    :param config_path: Path to config file.

    :return: Object with service options.
    """
    with open(config_path, 'r') as yaml_stream:
        service_options = ServiceOptions.parse_obj(yaml.safe_load(yaml_stream))
    return service_options
