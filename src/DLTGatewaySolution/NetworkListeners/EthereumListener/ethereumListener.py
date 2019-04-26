import logging

from Config import Config


def main():
    logging.basicConfig(level=logging.INFO)
    Config.load_env()


if __name__ == '__main__':
    main()
