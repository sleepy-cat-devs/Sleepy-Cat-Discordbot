from options import Options

class Utility:

    #コマンドの実行権限の確認
    @classmethod
    def is_commander(self,user):
        slc=Options.getGuild()
        if user.id==slc.owner.id:#サーバー所有者
            return True
        role=slc.get_role(592960800935903242)#役職guri
        for member in slc.members:
            if member.id==user.id and role in member.roles:
                return True
        return False

    #メンバーの表示名を取得
    @classmethod
    def member_display_name(self,member):
        if member.nick is None:
            return member.name
        else:
            return member.nick
