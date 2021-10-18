import json

class Options:

    options=None
    try:
        with open("options.json","r",encoding="utf-8")as f:
            options=json.load(f)
    except FileNotFoundError:
        print("options.json が見つかりません")
        exit(1)
    print("options を読み込みました")
    print(options)

    guild=None

    @classmethod
    def set_is_release(self,is_release):
        Options.options["isRelease"]=is_release
        self._options_update()
        return

    #options.jsonの更新
    @classmethod
    def _options_update(self):
        with open("options.json","w",encoding="utf-8")as f:
            json.dump(Options.options,f,indent=4)

    @classmethod
    def get_token(self):
        return Options.options["token"]

    @classmethod
    def get_guild_id(self):
        return Options.options["guild_id"]

    @classmethod
    def set_guild(self,guild):
        Options.guild=guild
        return

    @classmethod
    def get_guild(self):
        return Options.guild

    @classmethod
    def get_version(self):
        return Options.options["version"]

    @classmethod
    def get_is_release(self):
        return Options.options["isRelease"]

    @classmethod
    def get_channel_id(self,chname):
        if chname in Options.options["chID"].keys():
            return Options.options["chID"][chname]
        else:
            return None

    @classmethod
    def is_test_voice_channel(self,vch_id):
        return vch_id in Options.options["vchID"].values()
