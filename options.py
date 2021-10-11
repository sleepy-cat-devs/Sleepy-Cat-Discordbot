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
    def set_is_release(self,isrelease):
        if isrelease:
            self.options['isRelease']=True
        return

    #options.jsonの更新
    def options_update(self):
        with open('options.json','w',encoding='utf-8')as f:
            json.dump(self.options,f,indent=4)

    @classmethod
    def getToken(self):
        return self.options['token']

    @classmethod
    def getGuildID(self):
        return self.options['guild_id']

    @classmethod
    def setGuild(self,guild):
        self.guild=guild

    @classmethod
    def getGuild(self):
        return self.guild

    @classmethod
    def getVersion(self):
        return self.options['version']

    @classmethod
    def getisRelease(self):
        return self.options['isRelease']

    @classmethod
    def getChannelID(self,chname):
        return self.options['chID'][chname]

