import traceback
import datetime

from discord.ext import commands

from messagepost import MessagePost

class VCSupportCog(commands.Cog):

    def __init__(self,bot):
        self.bot=bot
        self.vcDict={}

    try:
        #通話ステータスの変化を取得するイベント
        #通話参加時
        @commands.Cog.listener(name='on_voice_state_update')
        async def join_vc(self,member,before,after):
            print(member,before,after,sep='\n',end='\n\n')
            if before.channel!=after.channel and before.channel is None:
                memberDispName=MessagePost.memberDisplayName(member)
                mes=memberDispName+'が<#'+str(after.channel.id)+'>に参加しました'
                if not after.channel.id in self.vcDict.keys():
                    self.vcDict[after.channel.id]={}
                    self.vcDict[after.channel.id]["members"]=[member]
                    self.vcDict[after.channel.id]["nowTime"]=datetime.timedelta()
                else:
                    if not member in self.vcDict[after.channel.id]["members"]:
                        self.vcDict[after.channel.id]["members"].append(member)
                if len(after.channel.id.members)==2:
                    self.vcDict[after.channel.id]["startTime"]=datetime.datetime.now()
                #通話参加メッセージ
                if after.channel.id==844511663096463380:
                    await MessagePost.message_send(mes,'bot-test')
                else:
                    await MessagePost.message_send(mes,'slcls')
                return
            return


        #画面共有開始時
        @commands.Cog.listener(name='on_voice_state_update')
        async def share_window(self,member,before,after):
            if before.self_stream!=after.self_stream and before.self_stream is False:
                mes=MessagePost.memberDisplayName(member)
                mes+='が<#'+str(after.channel.id)+'>で画面共有を始めました'
                if after.channel.id==844511663096463380:
                    await MessagePost.message_send(mes,'bot-test')
                else:
                    await MessagePost.message_send(mes,'slcls')
            return

        #通話退出時
        @commands.Cog.listener(name='on_voice_state_update')
        async def leave_vc(self,member,before,after):
            if before.channel!=after.channel and after.channel is None:
                if len(before.channel.members)==0:
                    mes='<#'+str(before.channel.id)+'>の通話が終了しました\n>>> '
                    if before.channel.id in self.vcDict.keys():
                        vcData=self.vcDict.pop(before.channel.id)
                        time=self.__get_h_m_s(vcData["nowTime"])
                        members=vcData["members"]
                        print(time)
                        #参加者が1人か，通話時間が1分未満の場合終了時メッセージは表示しない
                        if len(members)==1 or (time[0][0]==0 and time[0][1]==0):
                            return
                        mes+="通話時間："+time[1]+"\n"
                        mes+="参加人数："+str(len(members))+"人\n"
                        mes+="参加者："+",".join([MessagePost.memberDisplayName(m) for m in members])
                    if before.channel.id==844511663096463380:
                        await MessagePost.message_send(mes,'bot-test')
                    else:
                        await MessagePost.message_send(mes,'slcls')
                else:
                    if before.channel.id in self.vcDict.keys() and len(before.channel.id.members)==1:
                        self.vcDict[before.channel.id]["nowTime"]+=datetime.datetime.now()-self.vcDict[before.channel.id]["startTime"]

                return
            return
    except:
        mes='エラー\n>>> ```'+traceback.format_exc()+'```'
        MessagePost.message_send(mes,'bot-test')

    # 時分秒に変換，ついでに文字列も
    def __get_h_m_s(td):
        m,s=divmod(td.seconds,60)
        h,m=divmod(m,60)
        text=(str(h)+"時間" if h>0 else "")+(str(m)+"分" if m>0 else "")+str(s)+"秒"
        return (h,m,s),text

def setup(bot):
    print('load VCSupportCog')
    return bot.add_cog(VCSupportCog(bot))
