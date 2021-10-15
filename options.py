import json

class Options:

    options=None
    try:
        with open('options.json','r',encoding='utf-8')as f:
            options=json.load(f)
    except FileNotFoundError:
        print('options.json が見つかりません')
        exit(1)
    print('options を読み込みました')
    print(options)

    @classmethod
    def set_is_release(self,is_release):
        if is_release:
            self.options['isRelease']=True
        return

    #options.jsonの更新
    def options_update(self):
        with open('options.json','w',encoding='utf-8')as f:
            json.dump(self.options,f,indent=4)

    @classmethod
    def get_token(self):
        return self.options['token']

    @classmethod
    def get_guild_id(self):
        return self.options['guild_id']

    @classmethod
    def set_guild(self,guild):
        self.guild=guild
        return

    @classmethod
    def get_guild(self):
        return self.guild

    @classmethod
    def get_version(self):
        return self.options['version']

    @classmethod
    def get_is_release(self):
        return self.options['isRelease']

    @classmethod
    def get_channel_id(self,chname):
        if chname in self.options["chID"].keys():
            return self.options['chID'][chname]
        else:
            return None
