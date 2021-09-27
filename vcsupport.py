# -*- coding:utf8 -*-

import datetime

class VCSupport:
    # ボイチャのデータ管理辞書
    vcDict={}

    # ボイチャに参加した
    @classmethod
    def joinVC(self,channel,member,startTime=datetime.datetime.now()):
        if  not channel in self.vcDict.keys():
            self.vcDict[channel]={}
            self.vcDict[channel]["startTime"]=startTime
            self.vcDict[channel]["members"]=[member]
        else:
            if not member in self.vcDict[channel]["members"]:
                self.vcDict[channel]["members"].append(member)

    # ボイチャ終了
    @classmethod
    def endVC(self,channel):
        if channel in self.vcDict.keys():
            vcData=self.vcDict.pop(channel)
            vcTime=datetime.datetime.now()-vcData["startTime"]
            return self.__get_h_m_s(vcTime),vcData["members"]
        else:
            return None,None

    # 時分秒に変換，ついでに文字列も
    def __get_h_m_s(td):
        m,s=divmod(td.seconds,60)
        h,m=divmod(m,60)
        text=(str(h)+"時間" if h>0 else "")+(str(m)+"分" if m>0 else "")+str(s)+"秒"
        return (h,m,s),text

if __name__=="__main__":
    VCSupport.joinVC("hoge","fuga",startTime=datetime.datetime(year=2021,month=9,day=27,hour=13))
    VCSupport.joinVC("hoge","piyo")
    VCSupport.joinVC("hoge","fuga")
    print(",".join(VCSupport.endVC("hoge")[1]))
