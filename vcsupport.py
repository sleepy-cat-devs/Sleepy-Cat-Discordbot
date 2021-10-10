# -*- coding:utf8 -*-

import datetime

class VCSupport:
    # ボイチャのデータ管理辞書
    vcDict={}

    # ボイチャに参加した
    @classmethod
    def joinVC(self,channel,member):
        chID=channel.id
        if not chID in self.vcDict.keys():
            self.vcDict[chID]={}
            self.vcDict[chID]["members"]=[member]
            self.vcDict[chID]["nowTime"]=datetime.timedelta()
        else:
            if not member in self.vcDict[chID]["members"]:
                self.vcDict[chID]["members"].append(member)
        if len(channel.members)==2:
            self.vcDict[chID]["startTime"]=datetime.datetime.now()

    @classmethod
    def leaveVC(self,channel,member):
        chID=channel.id
        if chID in self.vcDict.keys() and len(channel.members)==1:
            self.vcDict[chID]["nowTime"]+=datetime.datetime.now()-self.vcDict[chID]["startTime"]

    # ボイチャ終了
    @classmethod
    def endVC(self,channel):
        chID=channel.id
        if chID in self.vcDict.keys():
            vcData=self.vcDict.pop(chID)
            return self.__get_h_m_s(vcData["nowTime"]),vcData["members"]
        else:
            return None,None

    # 時分秒に変換，ついでに文字列も
    def __get_h_m_s(td):
        m,s=divmod(td.seconds,60)
        h,m=divmod(m,60)
        text=(str(h)+"時間" if h>0 else "")+(str(m)+"分" if m>0 else "")+str(s)+"秒"
        return (h,m,s),text

    # @classmethod
    # def countStart(self,channel):
    #     self.vcDict[channel]["startTime"]=datetime.datetime.now()

    # @classmethod
    # def countStop(self,channel):
    #     self.vcDict[channel]["nowTime"]+=datetime.datetime.now()-self.vcDict[channel]["startTime"]

if __name__=="__main__":
    VCSupport.joinVC("hoge","fuga",startTime=datetime.datetime(year=2021,month=9,day=27,hour=13))
    VCSupport.joinVC("hoge","piyo")
    VCSupport.joinVC("hoge","fuga")
    print(",".join(VCSupport.endVC("hoge")[1]))
